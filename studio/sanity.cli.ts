import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_PROJECT_ID || 'a67i5yzg',
    dataset: process.env.SANITY_DATASET || 'production',
  },
})
