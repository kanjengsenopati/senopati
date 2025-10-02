import React, { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAppSelector } from '../../stores/hooks';
import LayoutGuest from '../../layouts/Guest';
import WebSiteHeader from '../../components/WebPageComponents/Header';
import WebSiteFooter from '../../components/WebPageComponents/Footer';
import {
  HeroDesigns,
  ContactFormDesigns,
} from '../../components/WebPageComponents/designs';

import HeroSection from '../../components/WebPageComponents/HeroComponent';

import ContactFormSection from '../../components/WebPageComponents/ContactFormComponent';

export default function WebSite() {
  const cardsStyle = useAppSelector((state) => state.style.cardsStyle);
  const bgColor = useAppSelector((state) => state.style.bgLayoutColor);
  const projectName = 'senopati';

  useEffect(() => {
    const darkElement = document.querySelector('body .dark');
    if (darkElement) {
      darkElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`Contact Us - ${projectName}`}</title>
        <meta
          name='description'
          content={`Get in touch with the ${projectName} team for any inquiries, support, or feedback. We're here to help you optimize your manufacturing operations.`}
        />
      </Head>
      <WebSiteHeader projectName={'senopati'} />
      <main className={`flex-grow    bg-white  rounded-none  `}>
        <HeroSection
          projectName={'senopati'}
          image={['Customer support team ready']}
          mainText={`Reach Out to ${projectName} Today`}
          subTitle={`We're here to assist you with any questions or support you need. Connect with our team to enhance your manufacturing operations with ${projectName}.`}
          design={HeroDesigns.TEXT_CENTER || ''}
          buttonText={`Contact Us Now`}
        />

        <ContactFormSection
          projectName={'senopati'}
          design={ContactFormDesigns.WITH_IMAGE || ''}
          image={['Team ready to assist']}
          mainText={`Get in Touch with ${projectName} `}
          subTitle={`Feel free to reach out to us anytime. Our team is available to assist you and will respond promptly to your inquiries.`}
        />
      </main>
      <WebSiteFooter projectName={'senopati'} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
