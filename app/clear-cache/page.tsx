"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/container";

export default function ClearCachePage() {
  const [status, setStatus] = useState<string>("Checking...");
  const [caches, setCaches] = useState<string[]>([]);

  useEffect(() => {
    async function clearAllCaches() {
      try {
        if (!("serviceWorker" in navigator)) {
          setStatus("Service Worker not supported");
          return;
        }

        // Get all cache names
        const cacheNames = await window.caches.keys();
        setCaches(cacheNames);
        
        if (cacheNames.length === 0) {
          setStatus("No caches found");
          return;
        }

        // Delete all caches
        const deletePromises = cacheNames.map(cacheName => 
          window.caches.delete(cacheName)
        );
        
        await Promise.all(deletePromises);
        
        // Unregister all service workers
        const registrations = await navigator.serviceWorker.getRegistrations();
        const unregisterPromises = registrations.map(registration => 
          registration.unregister()
        );
        
        await Promise.all(unregisterPromises);
        
        setStatus(`✅ Successfully cleared ${cacheNames.length} cache(s) and ${registrations.length} service worker(s)`);
        
        // Reload after a delay
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
        
      } catch (error) {
        console.error("Error clearing cache:", error);
        setStatus(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    clearAllCaches();
  }, []);

  return (
    <Container className="min-h-screen py-20">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 dark:text-gray-100">
          Cache Temizleniyor
        </h1>
        
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-6">
          <p className="text-lg font-semibold mb-4 dark:text-gray-100">
            {status}
          </p>
          
          {caches.length > 0 && (
            <div className="text-left">
              <p className="font-semibold mb-2 dark:text-gray-200">Temizlenen Cache'ler:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {caches.map((cacheName, index) => (
                  <li key={index}>{cacheName}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-400">
          Ana sayfaya yönlendiriliyorsunuz...
        </p>
      </div>
    </Container>
  );
}

