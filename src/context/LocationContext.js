"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { checkPincode } from "@/lib/api/delivery";
import { useToast } from "@/context/ToastContext";
import PincodeModal from "@/components/layout/PincodeModal";

const PIN_KEY = "ks_pincode";
const PROMPTED_KEY = "ks_location_prompted";
const GEOCODE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

const LocationContext = createContext(null);

/** The pincode lives in localStorage — treated as an external store. */
function subscribe(callback) {
  window.addEventListener("ks:pincode-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("ks:pincode-change", callback);
    window.removeEventListener("storage", callback);
  };
}

const getPincodeSnapshot = () => window.localStorage.getItem(PIN_KEY);
const getServerPincodeSnapshot = () => null;

function writePincode(pin) {
  window.localStorage.setItem(PIN_KEY, pin);
  window.dispatchEvent(new Event("ks:pincode-change"));
}

export function LocationProvider({ children }) {
  const toast = useToast();
  const pincode = useSyncExternalStore(
    subscribe,
    getPincodeSnapshot,
    getServerPincodeSnapshot
  );

  const [delivery, setDelivery] = useState(null);
  // idle | detecting | checking | ready | error
  const [status, setStatus] = useState("idle");
  const [modalOpen, setModalOpen] = useState(false);

  // Re-check deliverability whenever the pincode changes.
  useEffect(() => {
    if (!pincode) return undefined;
    let cancelled = false;
    checkPincode(pincode)
      .then((res) => {
        if (cancelled) return;
        setDelivery(res);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setDelivery(null);
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [pincode]);

  /** Manual pincode entry (modal / anywhere). */
  const submitPincode = useCallback(
    (pin) => {
      const clean = String(pin || "").replace(/\D/g, "");
      if (clean.length !== 6) {
        toast.error("Please enter a valid 6-digit pincode.");
        return false;
      }
      setStatus("checking");
      writePincode(clean);
      setModalOpen(false);
      return true;
    },
    [toast]
  );

  /** Browser geolocation → reverse geocode → pincode. */
  const detectLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Location isn't available here — enter your pincode instead.");
      setModalOpen(true);
      return;
    }
    setStatus("detecting");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `${GEOCODE_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await res.json();
          const pin = String(data?.postcode || "").replace(/\D/g, "").slice(0, 6);
          if (pin.length === 6) {
            setStatus("checking");
            writePincode(pin);
            setModalOpen(false);
          } else {
            setStatus("error");
            setModalOpen(true);
          }
        } catch {
          setStatus("error");
          setModalOpen(true);
        }
      },
      () => {
        // Permission denied / unavailable → fall back to manual entry.
        setStatus("idle");
        setModalOpen(true);
      },
      { maximumAge: 600000, timeout: 8000 }
    );
  }, [toast]);

  // First visit (per the nav spec): prompt for location once on mount.
  useEffect(() => {
    if (pincode) return undefined;
    if (window.localStorage.getItem(PROMPTED_KEY)) return undefined;
    window.localStorage.setItem(PROMPTED_KEY, "1");
    const t = setTimeout(() => detectLocation(), 1200);
    return () => clearTimeout(t);
  }, [pincode, detectLocation]);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const value = useMemo(
    () => ({
      pincode,
      delivery,
      status,
      serviceable:
        delivery == null ? null : Boolean(delivery.serviceable ?? delivery.active),
      submitPincode,
      detectLocation,
      openModal,
      closeModal,
      modalOpen,
    }),
    [
      pincode,
      delivery,
      status,
      submitPincode,
      detectLocation,
      openModal,
      closeModal,
      modalOpen,
    ]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
      <PincodeModal />
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within LocationProvider");
  return ctx;
}
