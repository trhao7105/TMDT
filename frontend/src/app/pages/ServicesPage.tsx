import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../../api/axios";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Clock,
  Truck,
  Package as PackageIcon,
  Box,
  Info,
  CheckCircle,
  MapPin,
} from "lucide-react";

interface DurationOption {
  id: string;
  label: string;
  value: number;
  multiplier: number;
  popular?: boolean;
}

interface ProtectionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

interface AdditionalService {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  unit: string;
  requiresInput?: boolean;
  inputLabel?: string;
  inputUnit?: string;
}

export function ServicesPage() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [selectedDuration, setSelectedDuration] = useState<string>("duration-1");
  const [selectedProtection, setSelectedProtection] = useState<string>("protection-basic");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceInputs, setServiceInputs] = useState<Record<string, number>>({
    "service-transport": 0,
    "service-packing": 0,
  });
  const [transportAddress, setTransportAddress] = useState("");
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isProtectionDetailOpen, setIsProtectionDetailOpen] = useState(false);

  useEffect(() => {
    const savedBooking = localStorage.getItem("booking");
    if (!savedBooking) {
      navigate("/storage");
      return;
    }
    setBooking(JSON.parse(savedBooking));
  }, [navigate]);

  const [durationOptions, setDurationOptions] = useState<DurationOption[]>([]);
  const [protectionPlans, setProtectionPlans] = useState<ProtectionPlan[]>([]);
  const [additionalServices, setAdditionalServices] = useState<AdditionalService[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await api.get('/services/options');
        setDurationOptions(response.data.durationOptions);
        setProtectionPlans(response.data.protectionPlans);
        setAdditionalServices(response.data.additionalServices);
        
        if (response.data.durationOptions.length > 0) {
          setSelectedDuration(response.data.durationOptions[0].id);
        }
        if (response.data.protectionPlans.length > 0) {
          setSelectedProtection(response.data.protectionPlans[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch options", error);
      } finally {
        setIsLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  const calculatePrice = () => {
    if (!booking) return { storagePrice: 0, protectionPrice: 0, servicesPrice: 0, totalPrice: 0 };

    const selectedDurationObj = durationOptions.find((d) => d.id === selectedDuration);
    const selectedProtectionObj = protectionPlans.find((p) => p.id === selectedProtection);

    const storagePrice = Math.round(
      booking.storage.price * (selectedDurationObj?.multiplier || 1)
    );

    const protectionPrice = (selectedProtectionObj?.price || 0) * (selectedDurationObj?.value || 1);

    let servicesPrice = 0;
    selectedServices.forEach((serviceId) => {
      const service = additionalServices.find((s) => s.id === serviceId);
      if (service) {
        if (service.requiresInput && service.inputLabel === "Khoảng cách (km)") {
          const km = serviceInputs[serviceId] || 0;
          servicesPrice += service.basePrice + km * 10000;
        } else if (service.requiresInput && service.inputLabel === "Số lượng") {
          const boxes = serviceInputs[serviceId] || 0;
          if (boxes > 10) {
            servicesPrice += (boxes - 10) * service.basePrice;
          }
        } else {
          servicesPrice += service.basePrice;
        }
      }
    });

    const totalPrice = storagePrice + protectionPrice + servicesPrice;

    return { storagePrice, protectionPrice, servicesPrice, totalPrice, km: serviceInputs[additionalServices.find(s => s.inputLabel === "Khoảng cách (km)")?.id || ""] || 0 };
  };

  const pricing = calculatePrice();

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleServiceInputChange = (serviceId: string, value: number) => {
    setServiceInputs((prev) => ({ ...prev, [serviceId]: value }));
  };

  const calculateDistanceFromAddress = async (address: string) => {
    if (!address || !booking?.location) return 0;
    
    setIsCalculatingDistance(true);
    
    try {
      // Use OpenStreetMap Nominatim API for geocoding with Viewbox restriction
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&viewbox=106.3,10.3,107.1,11.0&bounded=1&limit=1`,
        {
          headers: {
            'User-Agent': 'iLocker-Storage-App'
          }
        }
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const userLat = parseFloat(data[0].lat);
        const userLon = parseFloat(data[0].lon);
        
        // Location coordinates from booking - ensure we have them
        // Robust mapping by ID and Name to prevent any data loss from old sessions
        let locLat = 0;
        let locLon = 0;
        
        // Check for various possible ID or name formats
        const rawId = booking.location.id || booking.location.location_id;
        const locId = rawId?.toString();
        const locName = (booking.location.name || booking.location.location_name || "").toLowerCase();

        if (locId === "1" || locName.includes("quận 1") || locName.includes("q1")) {
          locLat = 10.7731; locLon = 106.7042;
        } else if (locId === "2" || locName.includes("quận 7") || locName.includes("q7")) {
          locLat = 10.7299; locLon = 106.7217;
        } else if (locId === "3" || locName.includes("thủ đức") || locName.includes("thu duc")) {
          locLat = 10.8499; locLon = 106.7719;
        } else if (locId === "4" || locName.includes("bình thạnh") || locName.includes("binh thanh")) {
          locLat = 10.8044; locLon = 106.7078;
        } else if (locId === "5" || locName.includes("tân bình") || locName.includes("tan binh")) {
          locLat = 10.8015; locLon = 106.6520;
        } 
        
        // Final override: If the booking object actually has latitude/longitude, USE IT (it's most accurate)
        if (booking.location.latitude && booking.location.longitude) {
          locLat = parseFloat(booking.location.latitude.toString());
          locLon = parseFloat(booking.location.longitude.toString());
        }

        // If still 0, use District 1 default
        if (locLat === 0) {
          locLat = 10.7731; locLon = 106.7042;
        }

        // Distance calculation
        const R = 6371;
        const dLat = (locLat - userLat) * (Math.PI / 180);
        const dLon = (locLon - userLon) * (Math.PI / 180);
        const a = 
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(userLat * (Math.PI / 180)) * Math.cos(locLat * (Math.PI / 180)) * 
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let distance = R * c;
        
        // HCMC routing multiplier (1.5x)
        distance = Math.round(distance * 1.5 * 10) / 10;
        
        // Minimum 3km
        if (distance < 3) distance = 3.0;

        // Set a debug string to verify in the UI
        console.log(`Calculating distance from ${booking.location.name} (${locId}) to destination: ${distance}km`);

        const transportService = additionalServices.find(s => s.inputLabel === "Khoảng cách (km)");
        if (transportService) {
          setServiceInputs(prev => ({
            ...prev,
            [transportService.id]: distance
          }));
        }
      } else {
        // Improved fallback logic if geocoding fails
        console.warn("Geocoding failed, using warehouse-to-district fallback");
        const addr = address.toLowerCase();
        const locName = booking.location.name.toLowerCase();
        let fallbackDistance = 5; // Default

        // Logic: Distance from Warehouse to Destination District
        if (locName.includes("thủ đức")) {
          if (addr.includes("quận 1") || addr.includes("quận 3") || addr.includes("quận 4")) fallbackDistance = 15;
          else if (addr.includes("quận 7") || addr.includes("nhà bè")) fallbackDistance = 20;
          else if (addr.includes("bình tân") || addr.includes("quận 12")) fallbackDistance = 25;
          else fallbackDistance = 8; // Within Thủ Đức
        } else if (locName.includes("quận 1")) {
          if (addr.includes("quận 1") || addr.includes("quận 3")) fallbackDistance = 3;
          else if (addr.includes("thủ đức") || addr.includes("quận 9")) fallbackDistance = 15;
          else fallbackDistance = 10;
        } else if (locName.includes("quận 7")) {
          if (addr.includes("quận 7")) fallbackDistance = 4;
          else if (addr.includes("quận 1") || addr.includes("quận 4")) fallbackDistance = 8;
          else fallbackDistance = 15;
        }

        const transportService = additionalServices.find(s => s.inputLabel === "Khoảng cách (km)");
        if (transportService) {
          setServiceInputs(prev => ({ ...prev, [transportService.id]: fallbackDistance }));
        }
      }
    } catch (error) {
      console.error("Distance calculation error:", error);
    } finally {
      setIsCalculatingDistance(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTransportAddress(value);
    if (value.length <= 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Effect for fetching suggestions with debounce
  useEffect(() => {
    if (transportAddress.length > 3) {
      const timer = setTimeout(async () => {
        try {
          // Viewbox for HCMC: [lon1, lat1, lon2, lat2] -> [106.3, 10.3, 107.1, 11.0]
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(transportAddress)}&viewbox=106.3,10.3,107.1,11.0&bounded=1&limit=5&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'iLocker-Storage-App'
              }
            }
          );
          const data = await response.json();
          setAddressSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Autocomplete error:", error);
        }
      }, 500); // 500ms debounce for suggestions
      return () => clearTimeout(timer);
    }
  }, [transportAddress]);

  // Dedicated effect for distance calculation debounce (longer delay)
  useEffect(() => {
    if (transportAddress.length > 10) {
      const timer = setTimeout(() => {
        calculateDistanceFromAddress(transportAddress);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [transportAddress]);

  const handleSuggestionSelect = (suggestion: any) => {
    // Clean up address: take the first few parts and remove redundant city/country info
    const parts = suggestion.display_name.split(',');
    // Take at most 4 parts (e.g., Place, Street, Ward, District)
    const cleanAddress = parts.slice(0, 4).join(',').trim();
    
    setTransportAddress(cleanAddress);
    setAddressSuggestions([]);
    setShowSuggestions(false);
    calculateDistanceFromAddress(suggestion.display_name); // Use full address for accurate distance
  };

  const handleContinue = () => {
    if (booking) {
      const selectedDurationObj = durationOptions.find((d) => d.id === selectedDuration);
      const selectedProtectionObj = protectionPlans.find((p) => p.id === selectedProtection);
      const selectedServicesList = selectedServices.map((id) => {
        const service = additionalServices.find((s) => s.id === id);
        return {
          ...service,
          input: serviceInputs[id],
        };
      });

      localStorage.setItem(
        "booking",
        JSON.stringify({
          ...booking,
          duration: selectedDurationObj,
          protectionPlan: selectedProtectionObj,
          additionalServices: selectedServicesList,
          transportAddress,
          pricing,
        })
      );
      navigate("/checkout");
    }
  };

  if (!booking) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl mb-4 text-foreground">
            Chọn thời gian & dịch vụ
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tùy chỉnh gói dịch vụ phù hợp với nhu cầu của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {isLoadingOptions ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Đang tải các gói dịch vụ...
            </div>
          ) : (
            <>
              <div className="lg:col-span-2 space-y-8">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="text-foreground">Thời gian thuê</h2>
              </div>
              <RadioGroup value={selectedDuration} onValueChange={setSelectedDuration}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {durationOptions.map((duration) => (
                    <div
                      key={duration.id}
                      className={`relative flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                        selectedDuration === duration.id
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedDuration(duration.id)}
                    >
                      <RadioGroupItem value={duration.id} id={duration.id} />
                      <Label htmlFor={duration.id} className="flex-1 cursor-pointer">
                        <div className="flex flex-col">
                          <div className="text-foreground font-medium">{duration.label}</div>
                          <div className="text-[10px] text-muted-foreground uppercase mt-1">
                            {duration.value < 1 ? "Gói ngắn hạn" : "Gói dài hạn"}
                          </div>
                        </div>
                      </Label>
                      {duration.popular && (
                        <Badge variant="secondary" className="absolute -top-2 -right-2 text-[10px] h-5">
                          Phổ biến
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h2 className="text-foreground">Gói bảo vệ</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary text-xs"
                  onClick={() => setIsProtectionDetailOpen(true)}
                >
                  <Info className="mr-1 h-3 w-3" />
                  So sánh các gói
                </Button>
              </div>
              <RadioGroup value={selectedProtection} onValueChange={setSelectedProtection}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {protectionPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative rounded-lg border p-4 cursor-pointer transition-colors ${
                        selectedProtection === plan.id
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedProtection(plan.id)}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-2 -right-2 bg-primary">Đề xuất</Badge>
                      )}
                      <div className="flex items-start space-x-3 mb-3">
                        <RadioGroupItem value={plan.id} id={plan.id} />
                        <div className="flex-1">
                          <Label htmlFor={plan.id} className="cursor-pointer">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-foreground">{plan.name}</span>
                              <span className="text-primary">
                                {plan.price === 0
                                  ? "Miễn phí"
                                  : `${plan.price.toLocaleString("vi-VN")}đ/tháng`}
                              </span>
                            </div>
                          </Label>
                          <ul className="space-y-1 mt-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                                <span className="text-primary">•</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="h-5 w-5 text-primary" />
                <h2 className="text-foreground">Dịch vụ bổ sung</h2>
              </div>
              <div className="space-y-4">
                {additionalServices.map((service) => (
                  <div
                    key={service.id}
                    className={`rounded-lg border p-4 transition-colors ${
                      selectedServices.includes(service.id)
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={service.id}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor={service.id} className="cursor-pointer">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <div className="text-foreground">{service.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {service.description}
                              </div>
                            </div>
                            <div className="text-primary text-sm whitespace-nowrap ml-4">
                              {service.basePrice.toLocaleString("vi-VN")}đ/{service.unit}
                              {service.inputUnit && (
                                <div className="text-xs text-muted-foreground">
                                  + {service.inputUnit}
                                </div>
                              )}
                            </div>
                          </div>
                        </Label>
                        {service.requiresInput && selectedServices.includes(service.id) && (
                          <div className="mt-3 space-y-3">
                            {service.inputLabel === "Khoảng cách (km)" && (
                              <div>
                                <Label htmlFor="transport-address" className="text-sm">
                                  Địa chỉ nhận hàng
                                </Label>
                                <div className="relative">
                                  <Input
                                    id="transport-address"
                                    placeholder="Nhập địa chỉ của bạn để tính quãng đường"
                                    value={transportAddress}
                                    onChange={handleAddressChange}
                                    onFocus={() => transportAddress.length > 3 && setShowSuggestions(true)}
                                    className="mt-1 pr-10"
                                  />
                                  {isCalculatingDistance && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                    </div>
                                  )}
                                  
                                  {showSuggestions && addressSuggestions.length > 0 && (
                                    <Card className="absolute z-50 w-full mt-1 shadow-xl border overflow-hidden">
                                      <ul className="divide-y max-h-60 overflow-y-auto">
                                        {addressSuggestions.map((s, idx) => (
                                          <li 
                                            key={idx}
                                            className="p-3 hover:bg-muted cursor-pointer text-sm transition-colors flex items-start gap-2"
                                            onClick={() => handleSuggestionSelect(s)}
                                          >
                                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                            <div className="flex flex-col">
                                              <span className="font-medium text-foreground">
                                                {s.display_name.split(',')[0]}
                                                {s.display_name.split(',')[1] ? `, ${s.display_name.split(',')[1]}` : ''}
                                              </span>
                                              <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                                                {s.display_name.split(',').slice(2).join(',').trim()}
                                              </span>
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    </Card>
                                  )}
                                </div>
                              </div>
                            )}
                            <div>
                              <Label htmlFor={`${service.id}-input`} className="text-sm">
                                {service.inputLabel}
                              </Label>
                              <Input
                                id={`${service.id}-input`}
                                type="number"
                                min="0"
                                value={serviceInputs[service.id] || 0}
                                onChange={(e) =>
                                  handleServiceInputChange(
                                    service.id,
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="mt-1 bg-muted/30 font-bold text-primary"
                                disabled={service.inputLabel === "Khoảng cách (km)"}
                              />
                              {service.inputLabel === "Khoảng cách (km)" && transportAddress.length > 0 && !isCalculatingDistance && (
                                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Đã tính theo địa chỉ: {serviceInputs[service.id]} km
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="mb-6 text-foreground">Tóm tắt giá</h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    Giá được tính dựa trên hệ số thời gian và các dịch vụ bạn chọn
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Khu vực</div>
                  <div className="text-foreground">{booking.location?.name}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-2">Kho đã chọn</div>
                  <div className="text-foreground">{booking.storage.name}</div>
                  <div className="text-sm text-muted-foreground">{booking.storage.dimension}</div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí lưu trữ</span>
                    <span className="text-foreground">
                      {pricing.storagePrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>

                  {pricing.km > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quãng đường vận chuyển</span>
                      <span className="text-foreground">{pricing.km} km</span>
                    </div>
                  )}

                  {pricing.protectionPrice > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gói bảo vệ</span>
                      <span className="text-foreground">
                        {pricing.protectionPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  )}

                  {pricing.servicesPrice > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Dịch vụ bổ sung</span>
                      <span className="text-foreground">
                        {pricing.servicesPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-foreground">Tổng cộng</span>
                    <span className="text-2xl text-primary">
                      {pricing.totalPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    Đã bao gồm thuế VAT
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button onClick={handleContinue} className="w-full" size="lg">
                  Tiếp tục thanh toán
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/storage")}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Quay lại
                </Button>
              </div>
            </Card>
          </div>
          </>
          )}
        </div>
      </div>

      {/* Protection Details Dialog */}
      <Dialog open={isProtectionDetailOpen} onOpenChange={setIsProtectionDetailOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Chi tiết các gói bảo mật & bảo hiểm</DialogTitle>
            <DialogDescription>
              Lựa chọn mức độ bảo vệ phù hợp cho tài sản của bạn
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] bg-muted/30">Tính năng \ Gói</TableHead>
                  {protectionPlans.map(plan => (
                    <TableHead key={plan.id} className={`text-center min-w-[120px] ${plan.popular ? 'text-primary font-bold' : ''}`}>
                      {plan.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-xs">Mức bồi thường (tối đa)</TableCell>
                  {protectionPlans.map(plan => {
                    const name = plan.name.toLowerCase();
                    let compensation = "5.000.000đ";
                    if (name.includes("silver")) compensation = "20.000.000đ";
                    else if (name.includes("gold")) compensation = "50.000.000đ";
                    else if (name.includes("platinum")) compensation = "150.000.000đ";
                    else if (name.includes("business")) compensation = "500.000.000đ";
                    
                    return (
                      <TableCell key={plan.id} className="text-center text-xs font-semibold text-foreground">
                        {compensation}
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-xs">Phí duy trì (/tháng)</TableCell>
                  {protectionPlans.map(plan => (
                    <TableCell key={plan.id} className={`text-center text-xs ${plan.popular ? 'text-primary font-bold' : ''}`}>
                      {plan.price === 0 ? "Miễn phí" : `${plan.price.toLocaleString("vi-VN")}đ`}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-xs">Giám sát Camera 24/7</TableCell>
                  {protectionPlans.map(plan => (
                    <TableCell key={plan.id} className="text-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-xs">Kiểm soát nhiệt độ</TableCell>
                  {protectionPlans.map(plan => (
                    <TableCell key={plan.id} className="text-center">
                      {plan.price >= 49000 ? <CheckCircle className="h-4 w-4 text-green-500 mx-auto" /> : <span className="text-muted-foreground">-</span>}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-xs">Bảo hiểm cháy nổ</TableCell>
                  {protectionPlans.map(plan => (
                    <TableCell key={plan.id} className="text-center">
                      {plan.price >= 99000 ? <CheckCircle className="h-4 w-4 text-green-500 mx-auto" /> : <span className="text-muted-foreground">-</span>}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-xs">Hỗ trợ khẩn cấp 24/7</TableCell>
                  {protectionPlans.map(plan => (
                    <TableCell key={plan.id} className="text-center">
                      {plan.price >= 199000 ? <CheckCircle className="h-4 w-4 text-green-500 mx-auto" /> : <span className="text-muted-foreground">-</span>}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg flex gap-3 items-start">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tất cả các gói đều bao gồm hệ thống báo động chống trộm và khóa bảo mật 3 lớp. 
              Gói <strong>Nâng cao</strong> được khuyên dùng cho các mặt hàng điện tử và thời trang. 
              Gói <strong>Toàn diện</strong> phù hợp cho tài sản giá trị cao hoặc lưu trữ lâu dài.
            </p>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setIsProtectionDetailOpen(false)}>Tôi đã hiểu</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
