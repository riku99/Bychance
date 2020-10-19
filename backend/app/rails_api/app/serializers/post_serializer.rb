class PostSerializer < ActiveModel::Serializer
  attributes :id, :text, :image, :date, :userID

  def date
    I18n.l(object.created_at)
  end

  def userID
    object.user.id
  end

end
