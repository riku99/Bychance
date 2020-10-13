class Api::V1::OthersController < ApplicationController
    def index
        unless user = checkAccessToken(params["id"] ,request.headers)
            render json: {loginError: true}
            return
        end
        others = User.all.map { |u| {
                                    id: u.id, 
                                    name: u.name, 
                                    image: u.image,
                                    introduce: u.introduce,
                                    message: u.message,
                                    posts: u.posts.map { |p| {
                                        id: p.id,
                                        text: p.text,
                                        image: p.image,
                                        date: I18n.l(p.created_at),
                                        userID: p.user.id
                                    }
                                    }
                                    }
                                }
        render json: {
            success: {
                others: others
            }
        }
    end
end
