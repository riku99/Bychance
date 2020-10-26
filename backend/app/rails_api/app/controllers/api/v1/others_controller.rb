class Api::V1::OthersController < ApplicationController
    before_action :checkAccessToken

    def index
        if @user
            near_others = User.within(params[:range], origin: [params[:lat], params[:lng]])
            display_others = near_others.select { |u| u.display }
            render json: display_others, each_serializer: OthersSerializer
        end
    end
end
