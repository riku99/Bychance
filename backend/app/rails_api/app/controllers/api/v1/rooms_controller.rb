class Api::V1::RoomsController < ApplicationController
    before_action :checkAccessToken
    def create
        if @user
            room = Room.between(@user.id, params[:recipient_id]).first
            if room.present?
                render json: {presence: true, room: room.id}
            else
                room = Room.create(sender_id: @user.id, recipient_id: params[:partner_id])
                render json: {presence: false, room: room.id}
            end
        else
            render json: { loginError: true }, status: 404
        end
    end
end
