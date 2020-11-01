class Api::V1::RoomsController < ApplicationController
    before_action :checkAccessToken
    def create
        if @user
            room = Room.get(@user.id, params[:user_id])
            render json: {room: room.id}
        else
            render json: { loginError: true }, status: 404
        end
    end
end
