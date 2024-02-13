import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'sanity-meetup-game',

  projectId: process.env.VITE_SANITY_PROJECT_ID || 'not-set',
  dataset: process.env.VITE_SANITY_DATASET || 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
