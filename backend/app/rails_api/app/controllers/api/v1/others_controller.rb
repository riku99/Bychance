class Api::V1::OthersController < ApplicationController
    before_action :checkAccessToken

    def index
        if @user
            near_others = User.within(3, origin: [35.667639, 140.012972])
            display_others = near_others.select { |u| u.display }
            render json: display_others
        end
    end
end
