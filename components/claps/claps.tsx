"use client";

import React, { useEffect, useMemo, useState } from "react";
import { debounce }  from "@/lib/utils";
import cx from "@/lib/cx";
import Icons from "./icons";
import "./style.css"
import { usePathname } from "next/navigation";
import useIsMobile from "@/hooks/useIsMobile";

const REACTION_DURATION = 600;

enum ReactionClass {
  default = "",
  no = "headShake animated",
  yes = "heartBeat animated",
}

type IClapsFixedProps = "left" | "center" | "right";

type IClapsProps = {
  key?: string;
  fixed?: IClapsFixedProps;
  replyUrl?: string;
  replyCount?: number | string;
  apiPath?: string;
  iconClap?: React.ReactElement;
  iconReply?: React.ReactElement;
};

export default function Claps({
  key,
  fixed,
  replyUrl,
  replyCount,
  apiPath = `/api/claps`,
  iconClap,
  iconReply,
}: IClapsProps) {
  const [ready, setReady] = useState<boolean>(false);
  const [reaction, setReaction] = useState<ReactionClass>(
    ReactionClass.default
  );
  const [cacheCount, setCacheCount] = useState<number>(0);
  const [data, setData] = useState<{
    totalScore: number;
    userScore: number;
    totalUsers: number;
    maxClaps: number;
  }>({
    totalScore: 0,
    userScore: 0,
    totalUsers: 0,
    maxClaps: 0,
  });
  const pathname = usePathname();
  fixed = useIsMobile() ? "right" : "center"

  const setReactionAnim = (reaction: ReactionClass) => {
    setReaction(reaction);
    return setTimeout(() => {
      setReaction(ReactionClass.default);
    }, REACTION_DURATION);
  };

  const onClapSaving = useMemo(
    () => debounce(async (score, data) => {
      const url = window.location.pathname
      const postId = url.substring(url.lastIndexOf('/') + 1);

      // Skip if no valid postId
      if (!postId || postId === '' || postId === 'undefined') {
        console.log('⚠️  Skipping clap save - no valid post ID');
        setCacheCount(0);
        return setReactionAnim(ReactionClass.no);
      }

      try {
        if (score >= data.maxClaps) {
          return setReactionAnim(ReactionClass.no);
        }

        console.log('👏 Saving clap for:', postId, 'score:', score);
        const url = `/api/claps?score=${score}&id=${encodeURIComponent(postId)}`
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });

        if (!response.ok) {
          console.log('❌ Clap save failed:', response.status);
          return setReactionAnim(ReactionClass.no);
        }

        const newData = await response.json();
        console.log('✅ Clap saved:', newData);
        setData(newData);

        setReactionAnim(ReactionClass.yes);
      } catch (error) {
        console.error('❌ Clap save error:', error);
      } finally {
        setCacheCount(0);
      }
    }, 1000),
    []
  );

  const onClap = () => {
    const value = cacheCount === data.maxClaps ? cacheCount : cacheCount + 1;
    setCacheCount(value);

    return onClapSaving(value, data);
  };

  const getData = async () => {
    const url = window.location.pathname
    const postId = url.substring(url.lastIndexOf('/') + 1);

    // Skip if no valid postId (e.g., on home page or root paths)
    if (!postId || postId === '' || postId === 'undefined') {
      console.log('⚠️  Skipping claps - no valid post ID');
      setReady(true);
      return;
    }

    try {
      console.log('👏 Fetching claps for:', postId);
      const url = "/api/claps?id=" + encodeURIComponent(postId)
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.log('❌ Claps fetch failed:', response.status);
        return;
      }

      const data = await response.json();
      console.log('✅ Claps data:', data);

      setData(data);
    } catch (error) {
      console.log('❌ Claps error:', error);
    } finally {
      setReady(true);
    }
  };  

  useEffect(() => {
    if(!pathname) return;
    
    // Reset state immediately when pathname changes to prevent showing old data
    setReady(false);
    setCacheCount(0);
    setData({
      totalScore: 0,
      userScore: 0,
      totalUsers: 0,
      maxClaps: 0,
    });
    
    getData();

    return () => {
      setReady(false);
      setCacheCount(0);
      setData({
        totalScore: 0,
        userScore: 0,
        totalUsers: 0,
        maxClaps: 0,
      })
    }
  }, [pathname])

  return (
    <div
      className={cx("claps-root", {
        [`claps-fixed claps-fixed-${fixed}`]: fixed,
      })}
      style={{
        // @ts-ignore
        "--animate-duration": `${REACTION_DURATION}ms`,
      }}
    >
      <Icons />
      <div className={cx("claps-body", reaction)}>
        <button
          disabled={!ready}
          title={`${data.totalUsers} users clapped`}
          aria-label="Clap"
          onClick={onClap}
          className={cx("claps-button claps-button-clap", {
            "claps-button-cache": cacheCount,
            clapped: data.userScore,
          })}
        >
          {iconClap || (
            <svg
              width="24"
              height="24"
              aria-label="clap"
              style={{ marginTop: -2 }}
            >
              {data.userScore ? (
                <use href="#icon-claps-fill" />
              ) : (
                <use href="#icon-claps" />
              )}
            </svg>
          )}

          {ready && (
            <span className="claps-button-text">
              {data.totalScore + cacheCount}
            </span>
          )}
        </button>

        {replyUrl && (
          <>
            <span className="claps-divider" />

            <a
              href={replyUrl}
              rel="noopener noreferrer"
              target="_blank"
              className="claps-button claps-button-reply"
              title={`Reply to this post - ${replyCount ? `${replyCount} replies` : 'Join the discussion'}`}
            >
              {iconReply || (
                <svg width="22" height="22" aria-label="reply">
                  <use href="#icon-reply" />
                </svg>
              )}
              {replyCount && (
                <span className="claps-button-text">{replyCount}</span>
              )}
            </a>
          </>
        )}
      </div>
    </div>
  );
}
