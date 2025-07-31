import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'
import 'dotenv/config'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

const uploadFolder = async (folderPath: string, folderType: 'songs' | 'images') => {
  const files = fs.readdirSync(folderPath)
  for (const file of files) {
    const filePath = path.join(folderPath, file)
    const publicId = file.split('.')[0]

    try {
      const res = await cloudinary.uploader.upload(filePath, {
        resource_type: folderType === 'songs' ? 'video' : 'image',
        folder: `echo/${folderType}`,
        public_id: publicId,
      })
      console.log(`${folderType === 'songs' ? '🎵' : '🖼️'} Uploaded: ${res.secure_url}`)
    } catch (err) {
      console.error(`❌ Failed to upload ${file}:`, err)
    }
  }
}

// ⬇️ Use correct absolute paths if needed
const songsFolder = path.join(process.cwd(), 'public/songs')
const imagesFolder = path.join(process.cwd(), 'public/images')

uploadFolder(songsFolder, 'songs')
uploadFolder(imagesFolder, 'images')
