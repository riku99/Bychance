class Api::V1::UserRoomMessageReadsController < ApplicationController
    before_action :check_access_token

    def create
        if @user
            unread_number = params[:unreadNumber]
            room_id = params[:roomId]
            room = Room.find(room_id)
            partner_messages = room.room_messages.where("user_id != ?", @user.id).limit(unread_number)
            partner_messages.each do |message|
                @user.user_room_message_reads.create(room_message_id: message.id, room_id: room_id)
            end
            render json: {result: true}
        else
            render json: { errorType: 'loginError' }, status: 401
        end
    end
end
