class Api::V1::UsersController < ApplicationController
  require 'net/http'
  require 'aws-sdk'

  before_action :check_access_token,
                only: %i[subsequent_login edit change_display update_position refresh index]

  def createNonce
    nonce = params['nonce']
    unless nonce
      render json: {errorType: "invalidError", message: "無効なログインです"}, status: 400
      return
    end
    new_nonce = Nonce.new(nonce: nonce)
    if new_nonce.save
      render json: {result: true}
    else
      render json: { errorType: "invalidError", message: "無効なログインです" }, status: 400
    end
  end

  def sample_login
    uid_hash = User.digest('kuro')
    token_hash = User.digest('riku')
    if user = User.find_by(uid: uid_hash)
      posts = user.posts.map { |p| PostSerializer.new(p) }
      room_arr = []
      message_arr = []
      rooms = user.sender_rooms.preload(:room_messages) + user.recipient_rooms.preload(:room_messages)
      rooms.each do |r|
        room_arr << RoomSerializer.new(r, { user: user })
        r.room_messages.each { |m| message_arr << RoomMessageSerializer.new(m) }
      end
      flashes = user.flashes
      not_expired_flashes = flashes.select { |f| (Time.zone.now - f.created_at) / (60 * 60) < 2 }
      flash_entities= not_expired_flashes.map { |f| FlashSerializer.new(f)}
      render json: {
               user: UserSerializer.new(user),
               posts: posts,
               rooms: room_arr,
               messages: message_arr,
               token: 'riku',
               flashes: flash_entities
             }
    else
      crypt = User.create_geolocation_crypt
      name = 'demo'
      image = nil
      lat = crypt.encrypt_and_sign(35.6486)
      lng = crypt.encrypt_and_sign(140.042)
      user =
        User.create(
          name: name,
          uid: uid_hash,
          image: image,
          introduce: '',
          message: '',
          display: false,
          lat: lat,
          lng: lng,
          token: token_hash
        )
      render json: {
               user: UserSerializer.new(user),
               posts: [],
               rooms: [],
               messages: [],
               token: 'riku'
             }
    end
  end

  def first_login
    token = getToken(request.headers)
    body = {
      id_token: token, client_id: Rails.application.credentials.line[:client_id]
    }
    uri = URI.parse('https://api.line.me/oauth2/v2.1/verify')
    response = Net::HTTP.post_form(uri, body)
    parsed_response = JSON.parse(response.body)

    unless nonce = Nonce.find_by(nonce: parsed_response['nonce'])
      render json: { errorType: "loginError" }, status: 401
      return
    end

    if uid = parsed_response['sub']
      uid_hash = User.digest(uid)
      token = User.new_token
      token_hash = User.digest(token)
      if user = User.find_by(uid: uid_hash)
        user.update_attribute(:token, token_hash)
        result = create_user_data(user)
        result[:token] = token
        render json: result
      else
        user_name = parsed_response['name']
        user_image = parsed_response['picture']
        decryptable_crypt = User.create_geolocation_crypt
        #user_lat = decryptable_crypt.encrypt_and_sign(user_params[:lat]) # コメント　最初のログインではnullでいい?
        #user_lng = decryptable_crypt.encrypt_and_sign(user_params[:lng])
        user =
          User.create(
            name: user_name,
            uid: uid_hash,
            token: token_hash,
            image: user_image,
            introduce: '',
            message: '',
            display: false,
            lat: nil,
            lng: nil
          )
        render json: {
                 user: UserSerializer.new(user),
                 posts: [],
                 rooms: [],
                 messages: [],
                 token: token
               }
      end
      nonce.destroy
    else
      render json: { errorType: "loginError" }, status: 401
      nonce.destroy
    end

    if parsed_response['error']
      render json: { errorType: "loginError" }, status: 401
      nonce.destroy
    end
  end

  def subsequent_login
    if @user
      result = create_user_data(@user)
      render json: result
    else
      render json: { errorType: "loginError" }, status: 401
    end
  end

  def edit
    if @user
      name = user_params['name']
      introduce = user_params['introduce']
      message = user_params['message']
      if image = user_params['image']
        url = create_s3_object_path(image, 'user', "#{@user.id}")
      elsif params["deleteImage"]
        url = nil
      else
        url = @user.image
      end
      if @user.update(
           name: name, introduce: introduce, image: url, message: message
         )
        render json: @user, serializer: UserEditItemSerializer
        return
      else
        render json: { errorType: "invalidError", message: @user.errors.full_messages[0] }, status: 400
      end
    else
      render json: {errorType: "loginError"}, status: 401
    end
  end

  def index
    if @user
      crypt = User.create_geolocation_crypt
      displayed_others = User.preload(:posts).preload(:flashes).select(&:display)
      near_others =
        displayed_others.select do |user|
          user.lat = crypt.decrypt_and_verify(user.lat)
          user.lng = crypt.decrypt_and_verify(user.lng)
          user.distance_to([params[:lat], params[:lng]]) < params[:range].to_f
        end
      sorted_others =
        near_others.each do |user|
          user.get_distance(params[:lat], params[:lng])
        end.sort_by(
          &:distance
        )
      render json: sorted_others, each_serializer: AnotherUserSerializer, user: @user
      return
    else
      render json: {errorType: "loginError"}, status: 401
    end
  end

  def update_position
    if @user
      crypt = User.create_geolocation_crypt
      @user.update(
        lat: crypt.encrypt_and_sign(user_params[:lat]),
        lng: crypt.encrypt_and_sign(user_params[:lng])
      )
      render json: { success: true }
    else
      render json: { loginError: true }, status: 401
    end
  end

  def change_display
    if @user
      display = params['display']
      @user.update(display: display)
      render json: { success: true }
      return
    else
      render json: { loginError: true }, status: 401
      return
    end
  end

  def refresh
    if @user
      if (@user.id == params["userId"])
        render json: {
          isMyData: true,
          data: UserSerializer.new(@user)
        }
      else
        target_user = User.find(params["userId"])
        render json: {
          isMyData: false,
          data: AnotherUserSerializer.new(target_user, {user: @user})
        }
      end
    else
      render json: {errorType: "loginError"}, status: 401
    end
  end

  private

  def user_params
    params.require(:user).permit(
      :id,
      :name,
      :introduce,
      :image,
      :message,
      :lat,
      :lng
    )
  end
end
