Rails.application.routes.draw do
  namespace 'api' do
    namespace 'v1' do
      post '/sample_login', to: 'users#sample_login'
      post '/first_login', to: 'users#first_login'
      post '/subsequent_login', to: 'users#subsequent_login'
      post '/nonce', to: 'users#createNonce'
      patch '/user', to: 'users#edit'
      patch '/user/position', to: 'users#update_position'
      patch '/user/display', to: 'users#change_display'

      post '/post', to: 'posts#create'
      delete '/post', to: 'posts#destroy'

      get '/others', to: 'others#index'

      post '/rooms', to: 'rooms#create'

      post '/messages', to: 'room_messages#create'
      patch '/messages_read', to: 'room_messages#change_read'

      post '/flashes', to: 'flashes#create'

      get '/u', to: 'users#u'
    end
  end
end
