class Api::V1::RoomMessagesController < ApplicationController
    before_action :checkAccessToken

    def create
        if @user && @user.id == params[:user_id]
            new_message =  RoomMessage.new(room_id: params[:room_id], user_id: params[:user_id], text: params[:text])
            if new_message.save
                render json: new_message
            else
                render json: {errorType: "invalidError", message: new_message.errors.full_messages[0]}, status: 400
            end
        else
            render json: {errorType: "loginError"}, status: 401
        end
    end

    private

    def room_message_params
        params.require(:room_message).permit(:text, :room_id, :user_id)
    end
end
