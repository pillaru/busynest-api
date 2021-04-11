using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BusyNest.Domain.Organizations
{
    [JsonConverter(typeof(OrgNameJsonConverter))]
    public class OrgName
    {
        private readonly string name;

        // todo: database table has a length restriction of 120 characters for name
        public OrgName(string name) => this.name = name;

        public override string ToString() => name;

        public override int GetHashCode() => name.GetHashCode();

        public class OrgNameJsonConverter : JsonConverter<OrgName>
        {
            public override OrgName Read(ref Utf8JsonReader reader,
                                         Type typeToConvert,
                                         JsonSerializerOptions options)
            {
                return new OrgName(reader.GetString());
            }

            public override void Write(Utf8JsonWriter writer,
                OrgName value,
                JsonSerializerOptions options)
            {
                writer.WriteStringValue(value.ToString());
            }
        }
    }
}
