class Api::V1::RoomsController < ApplicationController
  before_action :check_access_token
  def create
    if @user
      room = Room.between(@user.id, params[:recipient_id]).first
      if room.present?
        render json: { id: room.id, timestamp: room.updated_at }
      else
        new_room =
          Room.create(sender_id: @user.id, recipient_id: params[:recipient_id])
        render json: { id: new_room.id, timestamp: new_room.created_at }
      end
    else
      render json: { loginError: true }, status: 401
    end
  end
end
