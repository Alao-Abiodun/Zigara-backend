async function update_subscription_status(id) {
    await User.updateOne(
      { chat_id: id },
      [ { "$set": { "mailing": { "$eq": [false, "$mailing"] } } } ]
    )
}

