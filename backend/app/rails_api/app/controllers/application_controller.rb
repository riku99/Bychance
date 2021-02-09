class ApplicationController < ActionController::API
  include AwsHelper
  include AuthHelper
  include LoginHelper

  # 当初idでアクセスのためのidが送信されていたが、途中からaccessIdに変更したので三項演算子で判断
  def check_access_token
    if @user = User.find_by(id: params[:id] ? params[:id] : params[:accessId])
      token = getToken(request.headers)
      if @user.token == User.digest(token)
        return @user
      else
        @user = false
      end
    end
  end

end
