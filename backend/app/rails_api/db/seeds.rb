20.times do |n|
    User.create(uid: "seed#{n}", name: "sample_user#{n}", image: nil, introduce: "Hello!", message: "number#{n}", display: true, token: "sample#{n}", lat: 35.6486, lng: 140.042)
end