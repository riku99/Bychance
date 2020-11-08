class Api::V1::RoomsController < ApplicationController
    before_action :checkAccessToken
    def create
        if @user
            room = Room.between(@user.id, params[:recipient_id]).first
            if room.present?
                render json: {presence: true, id: room.id}
            else
                new_room = Room.create(sender_id: @user.id, recipient_id: params[:recipient_id])
                render json: {presence: false, id: new_room.id}
            end
        else
            render json: { loginError: true }, status: 401
        end
    end
end
