class PostSerializer < ActiveModel::Serializer
  attributes :id, :text, :image, :date, :userId

  def date
    I18n.l(object.created_at)
  end

  def userId
    object.user.id
  end

end
