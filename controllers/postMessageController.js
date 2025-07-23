// const postMessage = async (req, res) => {
//   const { message, groupId } = req.body;
//   const userId = req.user.userId;

//   console.log("Message received:", { message, groupId, userId });

//   try {
//     const newMessage = await ChatMessage.create({
//       message,
//       groupId,
//       userId,
//     });

//     console.log("Message saved:", newMessage.toJSON());
//     return res.status(201).json(newMessage);
//   } catch (err) {
//     console.error("Error saving message:", err.message, err.stack);
//     return res.status(500).json({ msg: "Failed to save message" });
//   }
// };


// module.exports = {
//   postMessage
// }