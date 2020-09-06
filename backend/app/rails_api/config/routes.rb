Rails.application.routes.draw do
  namespace 'api' do
    namespace 'v1' do
      post '/login', to: 'users#login'
    end
  end
end
