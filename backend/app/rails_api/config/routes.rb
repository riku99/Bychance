Rails.application.routes.draw do
  namespace 'api' do
    namespace 'v1' do
      post '/sample_login', to: 'users#sample_login'
      post '/first_login', to: 'users#first_login'
      post '/subsequent_login', to: 'users#subsequent_login'
      post '/nonce', to: 'users#createNonce'
      get  '/users', to: 'users#index'
      patch '/user', to: 'users#edit'
      patch '/user/position', to: 'users#update_position'
      patch '/user/display', to: 'users#change_display'
      patch '/user/refresh', to: 'users#refresh'

      post '/post', to: 'posts#create'
      delete '/post', to: 'posts#destroy'

      post '/rooms', to: 'rooms#create'

      post '/messages', to: 'room_messages#create'

      post '/flashes', to: 'flashes#create'
      delete '/flashes', to: 'flashes#destroy'

      post '/user_flash_viewing', to: 'user_flash_viewings#create'

      post '/user_room_message_reads', to: 'user_room_message_reads#create'
    end
  end
end
