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
      validation: (v) => v.max(150),
    }),
    defineField({
      name: 'realTimeQuestion',
      title: 'Is community question?',
      type: 'boolean',
    }),
    // create a string with options Gustavo and Ryan. This is primary speaker for topic
    defineField({
      name: 'primarySpeaker',
      title: 'Primary Speaker',
      type: 'string',
      hidden: ({document}) => document?.realTimeQuestion === true,
      options: {
        list: ['Gustavo', 'Ryan', 'Both'],
      },
    }),

    defineField({
      name: 'userName',
      title: 'User Name',
      type: 'string',
      validation: (v) => v.max(34),
      hidden: ({document}) => !document?.realTimeQuestion,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      hidden: ({document}) => document?.realTimeQuestion === true,
    }),
  ],
})
