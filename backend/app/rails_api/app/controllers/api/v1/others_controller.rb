class Api::V1::OthersController < ApplicationController
  before_action :checkAccessToken

  def index
    if @user
      near_others =
        User.within(params[:range], origin: [params[:lat], params[:lng]])
      display_others = near_others.select(&:display)
      sorted_others = display_others.each {|user| user.sort_by_distance(params[:lat], params[:lng])}.sort_by {|u| u.distance}
      render json: sorted_others, each_serializer: OthersSerializer
    end
  end
end
