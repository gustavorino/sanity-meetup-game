import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'figure',
  title: 'Figure',
  type: 'object',
  fieldsets: [
    {
      name: 'aspectRatio',
      title: 'Aspect ratio',
      options: {collapsible: false, collapsed: false, columns: 2},
    },
  ],
  fields: [
    defineField({
      name: 'img',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'alt' || 'caption' || 'Image',
      media: 'img',
    },
  },
})
