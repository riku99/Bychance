class Api::V1::OthersController < ApplicationController
    before_action :checkAccessToken

    def index
        if @user
            @users = User.all
            render json: @users
        end
    end
end
