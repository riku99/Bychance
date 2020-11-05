class Api::V1::UsersController < ApplicationController
  require 'net/http'
  require 'aws-sdk'

  before_action :checkAccessToken,
                only: %i[subsequentLogin edit changeDisplay updatePosition]
  
  def u
    room = Room.first
    user = User.first
    m = RoomMessage.new(room_id: Room.first.id, user_id: user.id)
    #render json: {result: RoomSerializer.new(room, {user: user.id})}
    #render json: UserSerializer.new(user, {user: user.id}).as_json(include: ["posts", "rooms.room_messages"])
    render json: m
  end

  def createNonce
    nonce = params['nonce']
    unless nonce
      render json: { error: true }
      return
    end
    new_nonce = Nonce.new(nonce: nonce)
    if new_nonce.save
      render json: { nonce: true }
    else
      render json: { error: true }
    end
  end

  def firstLogin
    token = getToken(request.headers)
    body = {
      id_token: token, client_id: Rails.application.credentials.line[:client_id]
    }
    uri = URI.parse('https://api.line.me/oauth2/v2.1/verify')
    response = Net::HTTP.post_form(uri, body)
    parsed_response = JSON.parse(response.body)

    unless nonce = Nonce.find_by(nonce: parsed_response['nonce'])
      render json: { loginError: true }, status: 404
      return
    end

    if uid = parsed_response['sub']
      user_name = parsed_response['name']
      user_image = parsed_response['picture']
      uid_hash = uid.crypt(Rails.application.credentials.salt[:salt_key])
      token = User.new_token
      token_hash = token.crypt(Rails.application.credentials.salt[:salt_key])
      user_lat = user_params[:lat]
      user_lng = user_params[:lng]
      if user = User.find_by(uid: uid_hash)
        user.update_attribute(:token, token_hash)
        data = UserSerializer.new(user).as_json.merge(token: token)
        render json: data
      else
        user =
          User.create(
            name: user_name,
            uid: uid_hash,
            token: token_hash,
            image: user_image,
            introduce: '',
            message: '',
            display: false,
            lat: user_lat,
            lng: user_lng
          )
        data = UserSerializer.new(user).as_json.merge(token: token)
        render json: data
      end
      nonce.destroy
    else
      render json: { loginError: true }, status: 404
      nonce.destroy
    end

    if parsed_response['error']
      render json: { loginError: true }, status: 404
      nonce.destroy
      return
    end
  end

  def subsequentLogin
    if @user
      render json: UserSerializer.new(@user, {user: @user.id}).as_json(include: ["posts", "rooms.messages"])
    else
      render json: { loginError: true }, status: 404
    end
  end

  def edit
    if @user
      name = user_params['name']
      introduce = user_params['introduce']
      message = user_params['message']
      if image = user_params['image']
        url = createImagePath(image, 'user', `#{@user.id}`)
      else
        url = @user.image
      end
      if @user.update(
           name: name, introduce: introduce, image: url, message: message
         )
        render json: @user, serializer: UserWithoutPostsSerializer
        return
      else
        render json: { invalid: @user.errors.full_messages[0] }, status: 400
      end
    else
      render json: { loginError: true }, status: 404
    end
  end

  def updatePosition
    if @user
      @user.update(lat: user_params[:lat], lng: user_params[:lng])
      render json: { success: true }
    else
      render json: { loginError: true }, status: 404
    end
  end

  def changeDisplay
    if @user
      display = params['display']
      @user.update(display: display)
      render json: { success: true }
      return
    else
      render json: { loginError: true }, status: 404
      return
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
