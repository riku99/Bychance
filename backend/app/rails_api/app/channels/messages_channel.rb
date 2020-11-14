class MessagesChannel < ApplicationCable::Channel
  def subscribed
    stream_from "messages:messages_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
