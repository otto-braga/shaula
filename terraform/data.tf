# Buscar a AMI mais recente do Amazon Linux 2023
data "aws_ami" "ubuntu" {
  most_recent = true

  owners = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

}

# Buscar zonas de disponibilidade
data "aws_availability_zones" "available" {
  state = "available"
}

# Buscar VPC padrão (ou criar uma nova em network.tf)
data "aws_vpc" "default" {
  default = true
}

# Buscar subnets da VPC padrão
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}
