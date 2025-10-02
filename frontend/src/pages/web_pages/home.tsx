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
  AboutUsDesigns,
  ContactFormDesigns,
} from '../../components/WebPageComponents/designs';

import HeroSection from '../../components/WebPageComponents/HeroComponent';

import FeaturesSection from '../../components/WebPageComponents/FeaturesComponent';

import AboutUsSection from '../../components/WebPageComponents/AboutUsComponent';

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
      name: 'Inventory Management',
      description:
        'Maintain an organized inventory of raw materials and finished goods. Track usage, set reorder levels, and ensure optimal stock levels at all times.',
      icon: 'mdiWarehouse',
    },
    {
      name: 'Work Order Automation',
      description:
        'Easily create and manage work orders for production runs. Specify materials, labor, and machinery needed to streamline your production process.',
      icon: 'mdiClipboardCheck',
    },
    {
      name: 'Quality Control',
      description:
        'Implement quality checks at various production stages. Maintain compliance records and generate detailed quality reports to ensure product excellence.',
      icon: 'mdiCheckCircleOutline',
    },
    {
      name: 'Supplier Management',
      description:
        'Manage relationships with material suppliers, including contract terms, delivery schedules, and payment records, to ensure a smooth supply chain.',
      icon: 'mdiHandshakeOutline',
    },
    {
      name: 'Machinery Maintenance',
      description:
        'Keep a detailed log of all manufacturing equipment. Schedule maintenance and track downtime to maximize machinery efficiency.',
      icon: 'mdiWrench',
    },
    {
      name: 'Human Resources',
      description:
        'Manage employee data, roles, shifts, and payroll. Streamline recruitment and onboarding processes to build a skilled workforce.',
      icon: 'mdiAccountGroup',
    },
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`Comprehensive ERP Solution for Manufacturing`}</title>
        <meta
          name='description'
          content={`Discover our robust ERP solution tailored for the manufacturing industry, streamlining production, inventory, and workforce management for optimal efficiency.`}
        />
      </Head>
      <WebSiteHeader projectName={'senopati'} />
      <main className={`flex-grow    bg-white  rounded-none  `}>
        <HeroSection
          projectName={'senopati'}
          image={['Efficient manufacturing process illustration']}
          mainText={`Revolutionize Manufacturing with ${projectName} ERP`}
          subTitle={`Streamline your production, inventory, and workforce management with our comprehensive ERP solution tailored for the manufacturing industry. Gain full control and visibility over your operations.`}
          design={HeroDesigns.IMAGE_RIGHT || ''}
          buttonText={`Get Started Now`}
        />

        <FeaturesSection
          projectName={'senopati'}
          image={['Streamlined operations illustration']}
          withBg={1}
          features={features_points}
          mainText={`Unlock Efficiency with ${projectName} Features`}
          subTitle={`Explore the powerful features of ${projectName} that streamline your manufacturing operations and enhance productivity.`}
          design={FeaturesDesigns.CARDS_GRID_WITH_ICONS || ''}
        />

        <AboutUsSection
          projectName={'senopati'}
          image={['Team collaborating on ERP solutions']}
          mainText={`Empowering Manufacturing with ${projectName}`}
          subTitle={`At ${projectName}, we are dedicated to transforming the manufacturing industry with our innovative ERP solutions. Our mission is to simplify complex operations, enhance productivity, and drive growth for businesses worldwide.`}
          design={AboutUsDesigns.IMAGE_LEFT || ''}
          buttonText={`Learn More About Us`}
        />

        <ContactFormSection
          projectName={'senopati'}
          design={ContactFormDesigns.WITH_IMAGE || ''}
          image={['Customer support team assisting clients']}
          mainText={`Get in Touch with ${projectName} `}
          subTitle={`Reach out to us anytime for inquiries or support. Our team is here to assist you and will respond promptly to your messages.`}
        />
      </main>
      <WebSiteFooter projectName={'senopati'} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
