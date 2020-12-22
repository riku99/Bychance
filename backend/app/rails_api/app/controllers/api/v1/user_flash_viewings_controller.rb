class Api::V1::UserFlashViewingsController < ApplicationController
    before_action :check_access_token

    def create
        if @user
            flash_id = params[:flashId]
            @user.user_flash_viewings.create(flash_id: flash_id)
            render json: {result: true}
        else
            render json: {errorType: "loginError"}, status: 401
        end
    end
end
