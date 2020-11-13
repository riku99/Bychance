class Api::V1::UsersController < ApplicationController
  require 'net/http'
  require 'aws-sdk'

  before_action :checkAccessToken,
                only: %i[subsequent_login edit change_display update_position]
  
  def u
   @user = User.first
   posts_arr = []
      rooms_arr = []
      messages_arr = []
      @user.posts.each do |p|
        posts_arr << PostSerializer.new(p)
      end
      rooms = @user.rooms
      rooms.each do |room|
        rooms_arr << RoomSerializer.new(room, {user: @user.id})
        room.room_messages.each do |message|
          messages_arr << RoomMessageSerializer.new(message)
        end
      end
      posts_arr = @user.posts.map do |p|
        PostSerializer.new(p)
      end
      render json: {
        user: UserSerializer.new(@user),
        posts: posts_arr,
        rooms: rooms_arr,
        messages: messages_arr
      }
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

  def first_login
    token = getToken(request.headers)
    body = {
      id_token: token, client_id: Rails.application.credentials.line[:client_id]
    }
    uri = URI.parse('https://api.line.me/oauth2/v2.1/verify')
    response = Net::HTTP.post_form(uri, body)
    parsed_response = JSON.parse(response.body)

    unless nonce = Nonce.find_by(nonce: parsed_response['nonce'])
      render json: { loginError: true }, status: 401
      return
    end

    if uid = parsed_response['sub']
      uid_hash = User.digest(uid)
      token = User.new_token
      token_hash = User.digest(token)
      if user = User.find_by(uid: uid_hash)
        user.update_attribute(:token, token_hash)
        posts = user.posts.map { |p| PostSerializer.new(p) }
        rooms = []
        messages = []
        user.rooms.each do |r|
          rooms << RoomSerializer.new(r, {user: user.id})
          r.room_messages.each do |m|
            messages << RoomMessageSerializer.new(m)
          end
        end
        render json: {
          user: UserSerializer.new(user),
          posts: posts,
          rooms: rooms,
          messages: messages,
          token: token
        }
      else
        user_name = parsed_response['name']
        user_image = parsed_response['picture']
        decryptable_crypt = User.create_geolocation_crypt
        user_lat =  decryptable_crypt.encrypt_and_sign(user_params[:lat])
        user_lng = decryptable_crypt.encrypt_and_sign(user_params[:lng])
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
      render json: { loginError: true }, status: 401
      nonce.destroy
    end

    if parsed_response['error']
      render json: { loginError: true }, status: 401
      nonce.destroy
      return
    end
  end

  def subsequent_login
    if @user
      posts = @user.posts.map { |p| PostSerializer.new(p) }
        rooms = []
        messages = []
        @user.rooms.each do |r|
          rooms << RoomSerializer.new(r, {user: @user.id})
          r.room_messages.each do |m|
            messages << RoomMessageSerializer.new(m)
          end
        end
      render json: {
        user: UserSerializer.new(@user),
        posts: posts,
        rooms: rooms,
        messages: messages
      }
    else
      render json: { loginError: true }, status: 401
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
      render json: { loginError: true }, status: 401
    end
  end

  def update_position
    if @user
      crypt = User.create_geolocation_crypt
      @user.update(lat: crypt.encrypt_and_sign(user_params[:lat]), lng: crypt.encrypt_and_sign(user_params[:lng]))
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
