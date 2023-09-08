import formBuilder from '@payloadcms/plugin-form-builder'
import nestedDocs from '@payloadcms/plugin-nested-docs'
import redirects from '@payloadcms/plugin-redirects'
import seo from '@payloadcms/plugin-seo'
import dotenv from 'dotenv'
import path from 'path'
import { buildConfig } from 'payload/config'

import { Announcements } from './collections/Announcements'
import { CaseStudies } from './collections/CaseStudies'
import { CommunityHelp } from './collections/CommunityHelp'
import { Docs } from './collections/Docs'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { ReusableContent } from './collections/ReusableContent'
import { Users } from './collections/Users'
import richText from './fields/richText'
import { Footer } from './globals/Footer'
import { MainMenu } from './globals/MainMenu'
import { TopBar } from './globals/TopBar'
import syncDocs from './scripts/syncDocs'

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

const mockModulePath = path.resolve(__dirname, './emptyModuleMock.js')

export default buildConfig({
  rateLimit: {
    trustProxy: true,
    max: 4000,
  },
  collections: [
    Announcements,
    CaseStudies,
    CommunityHelp,
    Docs,
    Media,
    Pages,
    Posts,
    ReusableContent,
    Users,
  ],
  endpoints: [
    {
      path: '/sync/docs',
      method: 'get',
      handler: syncDocs,
    },
  ],
  globals: [Footer, MainMenu, TopBar],
  graphQL: {
    disablePlaygroundInProduction: false,
  },
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  plugins: [
    formBuilder({
      formOverrides: {
        fields: [
          richText({
            name: 'leader',
            label: 'Leader Text',
            admin: {
              elements: [],
            },
          }),
          {
            name: 'hubSpotFormID',
            type: 'text',
            admin: {
              position: 'sidebar',
            },
          },
        ],
      },
      formSubmissionOverrides: {
        hooks: {
          afterChange: [],
        },
      },
    }),
    seo({
      collections: ['case-studies', 'pages', 'posts'],
      uploadsCollection: 'media',
    }),
    nestedDocs({
      collections: ['pages'],
      generateLabel: (_, doc) => doc.title as string,
      generateURL: docs => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),
    redirects({
      collections: ['case-studies', 'pages', 'posts'],
    }),
  ],
  cors: [process.env.PAYLOAD_PUBLIC_APP_URL || '', 'https://payloadcms.com'].filter(Boolean),
  admin: {
    css: path.resolve(__dirname, './stylesheet.css'),
    webpack: config => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config?.resolve?.alias,
          react: path.resolve(__dirname, '../node_modules/react'),
          'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
          'react-router-dom': path.resolve(__dirname, '../node_modules/react-router-dom'),
          [path.resolve(__dirname, './scripts/fetch-discord')]: mockModulePath,
          [path.resolve(__dirname, '../node_modules/cli-progress')]: mockModulePath,
          [path.resolve(__dirname, '../node_modules/discord.js')]: mockModulePath,
          [path.resolve(__dirname, '../node_modules/discord-markdown')]: mockModulePath,
          [path.resolve(__dirname, './scripts/fetch-github')]: mockModulePath,
        },
      },
    }),
    components: {
      afterNavLinks: [],
    },
  },
})
