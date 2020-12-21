class Api::V1::UserFlashViewingsController < ApplicationController
    before_action :check_access_token

    def create
        if @user
            flash_id = params[:flashId]
            if @user.user_flash_viewings.create(flash_id: flash_id)
                render json: {result: true}
            else
                render json: {errorType: "invalidError"}, status: 400
            end
        else
            render json: {errorType: "loginError"}, status: 401
        end
    end
end
