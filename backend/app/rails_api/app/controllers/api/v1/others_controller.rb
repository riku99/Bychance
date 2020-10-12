class Api::V1::OthersController < ApplicationController
    def index
        unless user = checkAccessToken(params["id"] ,request.headers)
            render json: {loginError: true}
            return
        end
        others = User.all.map { |u| {id: u.id, name: u.name, image: u.image, introduce: u.introduce, message: u.message}}
        render json: {
            success: {
                others: others
            }
        }
    end
end
