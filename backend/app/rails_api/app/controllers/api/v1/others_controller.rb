class Api::V1::OthersController < ApplicationController
  before_action :checkAccessToken

  def index
    if @user
      crypt = User.create_geolocation_crypt
      display_others = User.select(&:display)
      near_others = display_others.select do |user|
        user.lat = crypt.decrypt_and_verify(user.lat)
        user.lng = crypt.decrypt_and_verify(user.lng)
        user.distance_to([params[:lat], params[:lng]]) < params[:range].to_f
      end
      sorted_others = near_others.each {|user| user.get_distance(params[:lat], params[:lng])}.sort_by {|u| u.distance}
      render json: sorted_others, each_serializer: OthersSerializer
      return
    else
      render json: {loginError: true}, status: 401
    end
  end
end
