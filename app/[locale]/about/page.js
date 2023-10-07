"use client";
import {useTranslations} from 'next-intl';

export default function About() {
    const t = useTranslations('common');
    return (
        <p>{t('about')}</p>
    );
}