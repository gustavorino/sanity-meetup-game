import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'card',
  title: 'Card',
  type: 'document',
  fields: [
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'string',
    }),
    defineField({
      name: 'realTimeQuestion',
      title: 'Real Time Question',
      type: 'boolean',
    }),
    // create a string with options Gustavo and Ryan. This is primary speaker for topic
    defineField({
      name: 'primarySpeaker',
      title: 'Primary Speaker',
      type: 'string',
      options: {
        list: ['Gustavo', 'Ryan', 'Both'],
      },
    }),

    defineField({
      name: 'userName',
      title: 'User Name',
      type: 'string',
      hidden: ({document}) => !document?.realTimeQuestion,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
  ],
})
