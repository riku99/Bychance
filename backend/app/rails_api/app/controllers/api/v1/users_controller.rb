class Api::V1::UsersController < ApplicationController
    def login
        render json: {user: "ok"}
    end
end
