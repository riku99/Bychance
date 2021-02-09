class Api::V1::RoomsController < ApplicationController
  before_action :check_access_token
  def create
    if @user
      room = Room.between(@user.id, params[:partnerId]).first
      if room.present?
        render json: { presence: true, roomId: room.id, timestamp: room.updated_at }
      else
        new_room =
          Room.create(sender_id: @user.id, recipient_id: params[:partnerId])
        render json: { presence: false, roomId: new_room.id, timestamp: new_room.created_at }
      end
    else
      render json: {errorType: "loginError"}, status: 401
    end
  end
end
