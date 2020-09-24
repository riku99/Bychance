class Api::V1::PostsController < ApplicationController
    def create
        render json: {result: "ok"}
    end
end
