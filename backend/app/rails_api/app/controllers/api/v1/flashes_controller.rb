class Api::V1::FlashesController < ApplicationController
    before_action :check_access_token

    def create
        if @user
            content_type = params[:contentType]
            content = params[:content]
            ext = params[:ext]
                url = create_s3_object_path(content, "flash", "#{@user.id}", ext)
                flash = @user.flashes.new(content: url, content_type: content_type)
                if (flash.save)
                    render json: flash
                else
                    render json: {errorType: "invalidError", message: flash.errors.full_messages[0]}, status: 400
                end
        else
            render json: {errorType: "loginError"}, status: 401
        end
    end

    def destroy
        if @user
            flash_id = params[:flashId]
            flash = Flash.find_by(id: flash_id)
            if @user.id == flash.user_id
                flash.destroy
                render json: {success: true}
            else
                render json: {errorType: "invalidError", message: "他のユーザーのものは削除できません"}, status: 400
            end
        else
            render json: {errorType: "loginError"}, status: 401
        end
    end
end
