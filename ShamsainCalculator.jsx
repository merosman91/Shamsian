import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SunIcon, Share2Icon } from "lucide-react";

export default function ShamsainCalculator() {
  const [fridgeSize, setFridgeSize] = useState(10);
  const [motorHP, setMotorHP] = useState(0);
  const [acUnits, setAcUnits] = useState(0);
  const [customDevices, setCustomDevices] = useState([
    { name: "", watts: 0, count: 1, hours: 1 },
  ]);
  const [reportTitle, setReportTitle] = useState("");
  const [systemType, setSystemType] = useState("منفصل");

  const fridgeWatts = fridgeSize * 12; // تقدير تقريبي
  const motorWatts = (motorHP * 746) / 0.85;
  const acWatts = acUnits * 3500;

  const customTotal = customDevices.reduce(
    (sum, d) => sum + d.watts * d.count * d.hours,
    0
  );

  const totalDailyConsumption =
    fridgeWatts * 12 * 0.5 + motorWatts * 0.5 + acWatts * 0.5 + customTotal;

  const panelWatts = 250;
  const numPanels = Math.ceil((totalDailyConsumption * 1.2) / (panelWatts * 5));
  const batteryAh = Math.ceil((totalDailyConsumption / 12) * 2);
  const inverterSize = Math.ceil(
    Math.max(fridgeWatts, motorWatts, acWatts) * 1.5
  );

  const shareOnWhatsApp = () => {
    const msg = `تقرير شمسين: ${reportTitle}\n\nالاستهلاك اليومي: ${totalDailyConsumption.toFixed(
      0
    )} واط\nعدد الألواح: ${numPanels} لوح\nسعة البطاريات: ${batteryAh}Ah\nالانفرتر: ${inverterSize} واط\nنوع النظام: ${systemType}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <SunIcon className="text-yellow-500" />
        <h1 className="text-2xl font-bold">شمسين</h1>
      </div>

      <Card className="mb-4">
        <CardContent className="grid gap-4 pt-4">
          <Input
            type="number"
            placeholder="قدم الثلاجة"
            value={fridgeSize}
            onChange={(e) => setFridgeSize(Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="عدد أحصنة موتور المياه"
            value={motorHP}
            onChange={(e) => setMotorHP(Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="عدد وحدات مكيف المياه"
            value={acUnits}
            onChange={(e) => setAcUnits(Number(e.target.value))}
          />

          {customDevices.map((d, i) => (
            <div key={i} className="grid grid-cols-4 gap-2">
              <Input
                placeholder="اسم الجهاز"
                value={d.name}
                onChange={(e) => {
                  const copy = [...customDevices];
                  copy[i].name = e.target.value;
                  setCustomDevices(copy);
                }}
              />
              <Input
                type="number"
                placeholder="واط"
                value={d.watts}
                onChange={(e) => {
                  const copy = [...customDevices];
                  copy[i].watts = Number(e.target.value);
                  setCustomDevices(copy);
                }}
              />
              <Input
                type="number"
                placeholder="عدد الأجهزة"
                value={d.count}
                onChange={(e) => {
                  const copy = [...customDevices];
                  copy[i].count = Number(e.target.value);
                  setCustomDevices(copy);
                }}
              />
              <Input
                type="number"
                placeholder="عدد الساعات"
                value={d.hours}
                onChange={(e) => {
                  const copy = [...customDevices];
                  copy[i].hours = Number(e.target.value);
                  setCustomDevices(copy);
                }}
              />
            </div>
          ))}

          <Button
            variant="outline"
            onClick={() =>
              setCustomDevices([...customDevices, { name: "", watts: 0, count: 1, hours: 1 }])
            }
          >
            + إضافة جهاز آخر
          </Button>

          <Textarea
            placeholder="عنوان التقرير"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
          />

          <Select value={systemType} onValueChange={setSystemType}>
            <SelectTrigger>
              <SelectValue placeholder="نوع النظام الشمسي" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="منفصل">منفصل (Off-Grid)</SelectItem>
              <SelectItem value="متصل">متصل بالشبكة (On-Grid)</SelectItem>
              <SelectItem value="هجين">هجين (Hybrid)</SelectItem>
            </SelectContent>
          </Select>

          <div className="bg-gray-100 rounded-xl p-4">
            <p>الاستهلاك اليومي: <strong>{totalDailyConsumption.toFixed(0)} واط</strong></p>
            <p>عدد الألواح: <strong>{numPanels} لوح × {panelWatts} واط</strong></p>
            <p>سعة البطاريات: <strong>{batteryAh}Ah</strong></p>
            <p>حجم الانفرتر: <strong>{inverterSize} واط</strong></p>
          </div>

          <Button onClick={shareOnWhatsApp} className="bg-green-600 hover:bg-green-700">
            <Share2Icon className="mr-2" /> مشاركة عبر واتساب
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}