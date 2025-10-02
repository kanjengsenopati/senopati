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
  FeaturesDesigns,
  FaqDesigns,
  ContactFormDesigns,
} from '../../components/WebPageComponents/designs';

import HeroSection from '../../components/WebPageComponents/HeroComponent';

import FeaturesSection from '../../components/WebPageComponents/FeaturesComponent';

import FaqSection from '../../components/WebPageComponents/FaqComponent';

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

  const features_points = [
    {
      name: 'Production Planning',
      description:
        'Optimize your production schedules and resources. Ensure timely delivery and efficient use of materials and labor.',
      icon: 'mdiCalendarClock',
    },
    {
      name: 'Real-Time Analytics',
      description:
        'Gain insights into your operations with real-time data. Make informed decisions to enhance productivity and reduce costs.',
      icon: 'mdiChartLine',
    },
    {
      name: 'Integrated Supply Chain',
      description:
        'Seamlessly manage your supply chain from procurement to delivery. Enhance collaboration with suppliers and improve logistics.',
      icon: 'mdiTruckFast',
    },
  ];

  const faqs = [
    {
      question: 'What industries can benefit from ${projectName}?',
      answer:
        '${projectName} is designed for the manufacturing industry, but its flexible features can be adapted to various sectors, including automotive, electronics, and consumer goods.',
    },
    {
      question: 'How does ${projectName} improve inventory management?',
      answer:
        '${projectName} offers real-time tracking of raw materials and finished goods, helping you maintain optimal stock levels and reduce waste through automated reorder alerts.',
    },
    {
      question: 'Can ${projectName} integrate with existing systems?',
      answer:
        'Yes, ${projectName} is designed to integrate seamlessly with your existing ERP, CRM, and other business systems, ensuring a smooth transition and data consistency.',
    },
    {
      question: 'Is training provided for new users?',
      answer:
        'Absolutely! We offer comprehensive training sessions and resources to ensure your team can effectively use ${projectName} and maximize its potential.',
    },
    {
      question: 'What kind of support is available?',
      answer:
        'Our dedicated support team is available 24/7 to assist with any issues or questions you may have, ensuring minimal disruption to your operations.',
    },
    {
      question: 'How secure is the data within ${projectName}?',
      answer:
        '${projectName} employs advanced security measures, including encryption and regular audits, to protect your data and ensure compliance with industry standards.',
    },
    {
      question: 'Can ${projectName} handle multiple locations?',
      answer:
        'Yes, ${projectName} is designed to manage operations across multiple locations, providing centralized control and visibility for all your facilities.',
    },
    {
      question: 'What is the pricing model for ${projectName}?',
      answer:
        '${projectName} offers flexible pricing plans based on the size of your business and the features you need. Contact us for a customized quote.',
    },
    {
      question: 'How long does it take to implement ${projectName}?',
      answer:
        'Implementation time varies based on the complexity of your operations, but our team works closely with you to ensure a smooth and timely deployment.',
    },
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`Our Services - ${projectName} ERP`}</title>
        <meta
          name='description'
          content={`Explore the comprehensive services offered by ${projectName} ERP, designed to optimize your manufacturing operations and drive business success.`}
        />
      </Head>
      <WebSiteHeader projectName={'senopati'} />
      <main className={`flex-grow    bg-white  rounded-none  `}>
        <HeroSection
          projectName={'senopati'}
          image={['Manufacturing process optimization illustration']}
          mainText={`Transform Your Operations with ${projectName}`}
          subTitle={`Discover the range of services offered by ${projectName} to streamline your manufacturing processes. From inventory management to quality control, we provide solutions that enhance efficiency and productivity.`}
          design={HeroDesigns.IMAGE_BG || ''}
          buttonText={`Explore Our Services`}
        />

        <FeaturesSection
          projectName={'senopati'}
          image={['Efficient service delivery illustration']}
          withBg={0}
          features={features_points}
          mainText={`Explore ${projectName} Core Services`}
          subTitle={`Our services are designed to optimize every aspect of your manufacturing operations, ensuring efficiency and growth.`}
          design={FeaturesDesigns.CARDS_GRID_WITH_ICONS || ''}
        />

        <FaqSection
          projectName={'senopati'}
          design={FaqDesigns.ACCORDION || ''}
          faqs={faqs}
          mainText={`Frequently Asked Questions about ${projectName} `}
        />

        <ContactFormSection
          projectName={'senopati'}
          design={ContactFormDesigns.HIGHLIGHTED || ''}
          image={['Customer service team assisting clients']}
          mainText={`Connect with ${projectName} Support `}
          subTitle={`Reach out to us anytime for inquiries or support. Our team is ready to assist you and will respond promptly to your messages.`}
        />
      </main>
      <WebSiteFooter projectName={'senopati'} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
