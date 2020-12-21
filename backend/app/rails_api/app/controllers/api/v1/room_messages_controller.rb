class Api::V1::RoomMessagesController < ApplicationController
  before_action :check_access_token

  def create
    if @user && @user.id == params[:user_id]
      new_message =
        RoomMessage.new(
          room_id: params[:room_id],
          user_id: params[:user_id],
          text: params[:text]
        )
      if new_message.save
        render json: new_message
        room = Room.find(params[:room_id])
        room.update_attribute(:updated_at, new_message.created_at)
        partner =
          room.sender != @user ? room.sender : room.recipient
        MessagesChannel.broadcast_to(
          "messages_channel_#{partner.id}",
          {
            message: RoomMessageSerializer.new(new_message),
            room: RoomSerializer.new(room, { user: partner })
          }
        )
      else
        render json: {
                 errorType: 'invalidError',
                 message: new_message.errors.full_messages[0]
               },
               status: 400
      end
    else
      render json: { errorType: 'loginError' }, status: 401
    end
  end

  def change_read
    if @user
      notReadMessages = RoomMessage.where(id: params[:message_ids])
      notReadMessages.each { |message| message.update_attribute(:read, true) }
      render json: RoomMessage.where(id: params[:message_ids]),
             each_serializer: RoomMessageSerializer
    else
      render json: { errorType: 'loginError' }, status: 401
    end
  end

  private

  def room_message_params
    params.require(:room_message).permit(:text, :room_id, :user_id)
  end
end
