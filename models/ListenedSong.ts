import mongoose from 'mongoose'

const ListenedSongSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  songId: { type: String, required: true },
}, { timestamps: true })

export default mongoose.models.ListenedSong || mongoose.model('ListenedSong', ListenedSongSchema)
