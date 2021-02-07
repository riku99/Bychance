class Api::V1::RoomMessagesController < ApplicationController
  before_action :check_access_token

  def create
    if @user && @user.id == params[:userId]
      new_message =
        RoomMessage.new(
          room_id: params[:roomId],
          user_id: params[:userId],
          text: params[:text]
        )
      if new_message.save
        render json: new_message
        room = Room.find(params[:roomId])
        room.update_attribute(:updated_at, new_message.created_at)
        partner =
          room.sender != @user ? room.sender : room.recipient
        MessagesChannel.broadcast_to(
          "messages_channel_#{partner.id}",
          {
            message: RoomMessageSerializer.new(new_message),
            room: RoomSerializer.new(room, { user: partner }),
            sender: AnotherUserSerializer.new(@user, user: partner) #　wsで相手に送信するデータなので自分をシリアライズする
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

  private

  def room_message_params
    params.require(:room_message).permit(:text, :room_id, :user_id)
  end
end
