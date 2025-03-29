"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { philosophical } from '@/lib/ai.json';

const PhilosophicalThemes = () => {
  const [language, setLanguage] = useState('en');

  const currentContent = philosophical.content[language];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 font-serif">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-primary">{currentContent.title}</h1>
          <p className="text-sm sm:text-md text-muted-foreground mb-4">{currentContent.subtitle}</p>

          <Button
            onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
            variant="outline"
            size="sm"
            className="text-primary border-primary hover:bg-primary/10 mx-auto"
          >
            {currentContent.toggleText}
          </Button>
        </header>

        <div className="space-y-4 sm:space-y-6">
          {currentContent.themes.map((theme, index) => (
            <Card key={index} className="bg-card text-card-foreground overflow-hidden border-border">
              <div className="h-1 bg-primary"></div>
              <CardContent className="p-3 sm:p-4">
                <h2 className="text-base sm:text-lg font-bold mb-2 text-primary">{theme.title}</h2>
                <p className="leading-relaxed text-xs sm:text-sm">{theme.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <footer className="mt-8 sm:mt-12 text-center text-muted-foreground text-xs sm:text-sm">
          <div className="w-12 sm:w-16 h-1 bg-muted mx-auto mb-3 sm:mb-4"></div>
          <p>"{currentContent.footer}"</p>
        </footer>
      </div>
    </div>
  );
};

export default PhilosophicalThemes;
