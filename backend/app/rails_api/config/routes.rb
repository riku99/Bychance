Rails.application.routes.draw do
  namespace 'api' do
    namespace 'v1' do
      post '/firstLogin', to: 'users#firstLogin'
      post '/subsequentLogin', to: 'users#subsequentLogin'
      post '/nonce', to: 'users#createNonce'
      patch '/user', to: 'users#edit'
      patch '/user/display', to: "users#changeDisplay"


      post '/post', to: 'posts#create'
      delete '/post', to: 'posts#destroy'

      get '/others', to: 'others#index'

      get '/u', to: 'users#u'
    end
  end
end
